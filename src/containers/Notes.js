import React from 'react';
import { API, Storage } from 'aws-amplify'
import config from '../config'
import { FormControl, ControlLabel, FormGroup } from 'react-bootstrap'
import LoaderButton from '../components/LoaderButton'
import { s3Upload, s3Remove } from '../libs/awsLib'

class Notes extends React.Component {
    constructor(props) {
        super(props);
        this.file = null
        this.state = {
            isLoading: false,
            isDeleting: false,
            note: null,
            content: '',
            attachmentUrl: ''
        };
    }

    validateForm = () => {
        return this.state.content.length > 0
    }

    formatFilename(str) {
        return str.replace(/^\w+-/, '')
    }

    handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    handleFileChange = event => {
        this.file = event.target.files[0];
    }

    saveNote(note) {
        return API.put('notes', `/notes/${this.props.match.params.id}`, {
            body: note
        })
    }

    deleteNote() {
        return API.del('notes', `/notes/${this.props.match.params.id}`)
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        if (this.file && this.file.size > config.MAX_FILE_SIZE) {
            alert("Please pick a file smaller than 5MB");
            return;
        }

        this.setState({ isLoading: true });
        try {
            let attachment;
            if (this.file) {
                if (this.state.note.attachment) await s3Remove(this.state.note.attachment)
                attachment = await s3Upload(this.file)
            }
            await this.saveNote({
                content: this.state.content,
                attachment: attachment || this.state.note.attachment
            })
            this.props.history.push('/')
        } catch (error) {
            alert(error)
            this.setState({ isLoading: false });
        }

    }

    handleDelete = async event => {
        event.preventDefault();

        const confirmed = window.confirm(
            "Are you sure you want to delete this note?"
        );

        if (!confirmed) {
            return;
        }

        this.setState({ isDeleting: true });
        try {
            if (this.state.note.attachment) await s3Remove(this.state.note.attachment)
            await this.deleteNote()
            this.props.history.push("/");
        } catch (error) {
            alert(error)
            this.setState({ isDeleting: false });
        }
    }

    render() {
        return (
            <div className="Notes">
                {this.state.note &&
                    <form onSubmit={this.handleSubmit}>
                        <FormGroup controlId="content">
                            <FormControl
                                onChange={this.handleChange}
                                value={this.state.content}
                                componentClass="textarea"
                            />
                        </FormGroup>
                        {this.state.note.attachment &&
                            <FormGroup>
                                <ControlLabel>Attachment</ControlLabel>
                                <FormControl.Static>
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={this.state.attachmentURL}
                                    >
                                        {this.formatFilename(this.state.note.attachment)}
                                    </a>
                                </FormControl.Static>
                            </FormGroup>}
                        <FormGroup controlId="file">
                            {!this.state.note.attachment &&
                                <ControlLabel>Attachment</ControlLabel>}
                            <FormControl onChange={this.handleFileChange} type="file" />
                        </FormGroup>
                        <LoaderButton
                            block
                            bsStyle="primary"
                            bsSize="large"
                            disabled={!this.validateForm()}
                            type="submit"
                            isLoading={this.state.isLoading}
                            text="Save"
                            loadingText="Saving…"
                        />
                        <LoaderButton
                            block
                            bsStyle="danger"
                            bsSize="large"
                            isLoading={this.state.isDeleting}
                            onClick={this.handleDelete}
                            text="Delete"
                            loadingText="Deleting…"
                        />
                    </form>}
            </div>
        )
    }

    getNote() {
        return API.get('notes', `/notes/${this.props.match.params.id}`)
    }

    async componentDidMount() {
        try {
            let attachmentUrl
            const note = await this.getNote()
            const { content, attachment } = note
            if (attachment) attachmentUrl = await Storage.vault.get(attachment)
            this.setState({
                note,
                content,
                attachmentUrl
            })
        } catch (error) {
            alert(error.message)
        }

    }
}

export default Notes;
