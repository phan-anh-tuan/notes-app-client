import React from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import './NewNote.css'
import config from '../config'
import LoaderButton from '../components/LoaderButton'
import { API } from 'aws-amplify'
import { s3Upload } from '../libs/awsLib'

class NewNote extends React.Component {
    constructor(props) {
        super(props);
        this.file = null
        this.state = {
            isLoading: false,
            content: ''
        };
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleFileChange = (e) => {
        this.file = e.target.files[0]
    }

    validateForm() {
        return this.state.content.length > 0
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        if (this.file && this.file.size > config.MAX_FILE_SIZE) {
            alert('please pick a file smaller than 5MB')
            return;
        }

        this.setState({
            isLoading: true
        })

        try {
            const attachment = this.file ? await s3Upload(this.file): null

            await this.createNote({
                content: this.state.content,
                attachment
            })
            this.props.history.push('/')

        } catch (error) {
            alert(error.message)
            this.setState({ isLoading: false });
        }
    }

    createNote(content) {
        return API.post('notes', '/notes', {
            body: content
        })
    }
    render() {
        return (
            <div className="NewNote">
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="content">
                        <FormControl
                            value={this.state.content}
                            onChange={this.handleChange}
                            componentClass="textarea" />
                    </FormGroup>
                    <FormGroup controlId="file" bsSize="large">
                        <ControlLabel>Attachment</ControlLabel>
                        <FormControl
                            onChange={this.handleFileChange}
                            type="file" />
                    </FormGroup>
                    <LoaderButton
                        block
                        bsStyle="primary"
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                        isLoading={this.state.isLoading}
                        text="Create"
                        loadingText="Creating…"
                    />
                </form>
            </div>
        )
    }

}

export default NewNote;
