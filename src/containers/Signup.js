import React from 'react';
import { HelpBlock, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import LoaderButton from '../components/LoaderButton'
import './Signup.css'
import { Auth } from 'aws-amplify'

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            email: "",
            password: "",
            confirmPassword: "",
            confirmationCode: "",
            newUser: null
        };
    }

    validateForm() {
        return this.state.email.length > 0 &&
            this.state.password.length > 0 &&
            this.state.password === this.state.confirmPassword
    }

    validateConfirmationForm() {
        return this.state.confirmationCode.length > 0
    }

    handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        this.setState({ isLoading: true })
        try {
            let newUser = await Auth.signUp({
                username: this.state.email,
                password: this.state.password
            })    
            this.setState({newUser})
        } catch (error) {
            alert(error.message)
        }
        
        this.setState({ isLoading: false })
    }

    handleConfirmationSubmit = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });

        try {
            await Auth.confirmSignUp(this.state.email, this.state.confirmationCode)    
            await Auth.signIn(this.state.email, this.state.password)

            this.props.userHasAuthenticated(true)
            this.props.history.push('/')
        } catch (error) {
            alert(error.message)
            this.setState({ isLoading: false })
        }
        
    }

    renderConfirmationForm() {
        return (
            <form onSubmit={this.handleConfirmationSubmit}>
                <FormGroup controlId="confirmationCode" bsSize="large">
                    <ControlLabel>Confirmation Code</ControlLabel>
                    <FormControl
                        autoFocus
                        type="tel"
                        value={this.state.confirmationCode}
                        onChange={this.handleChange} />
                    <HelpBlock>Please check your email for the code</HelpBlock>
                </FormGroup>
                <LoaderButton
                    block
                    bsSize="large"
                    isLoading={this.state.isLoading}
                    disabled={!this.validateConfirmationForm()}
                    type="submit"
                    text="Verify"
                    loadingText="Verifying" />
            </form>
        )
    }

    renderForm() {
        return (
            <form onSubmit={this.handleSubmit}>
                <FormGroup controlId="email" bsSize="large">
                    <ControlLabel>Email</ControlLabel>
                    <FormControl
                        autoFocus
                        type="email"
                        onChange={this.handleChange}
                        value={this.state.email} />
                </FormGroup>
                <FormGroup controlId="password" bsSize="large">
                    <ControlLabel>Password</ControlLabel>
                    <FormControl
                        type="password"
                        onChange={this.handleChange}
                        value={this.state.password} />
                </FormGroup>
                <FormGroup controlId="confirmPassword" bsSize="large">
                    <ControlLabel>Confirm Password</ControlLabel>
                    <FormControl
                        type="password"
                        onChange={this.handleChange}
                        value={this.state.confirmPassword} />
                </FormGroup>
                <LoaderButton
                    block
                    bsSize="large"
                    disabled={!this.validateForm()}
                    type="submit"
                    isLoading={this.state.isLoading}
                    text="Signup"
                    loadingText="Signing up…"
                />
            </form>
        )
    }

    render() {
        return (
            <div className="Signup">
                {this.state.newUser === null
                    ? this.renderForm()
                    : this.renderConfirmationForm()}
            </div>)
    }
}

export default Signup;
