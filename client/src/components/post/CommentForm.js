import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { addComment } from '../../actions/postActions';
import { clearErrors } from '../../actions/errorsActions';

class CommentForm extends Component {
    state = {
        text: '',
        errors: {}
    };

    // componentWillReceiveProps(newProps) {
    //   if (newProps.errors) {
    //     this.setState({errors: newProps.errors});
    //   }
    // }

    static getDerivedStateFromProps(nextProps) {
        return { errors: nextProps.errors };
    }

    onChange = e => {
        if (Object.keys(this.state.errors).length > 0) this.props.clearErrors();
        this.setState({ [e.target.name]: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault();

        const { user } = this.props.auth;
        const { postId } = this.props;
        const newComment = {
            text: this.state.text,
            name: user.name,
            avatar: user.avatar
        };
        this.props.addComment(postId, newComment);
        this.setState({ text: '' });
    };

    render() {
        const { errors } = this.state;

        return (
            <div className="post-form mb-3">
                <div className="card card-info">
                    <div className="card-header bg-info text-white">
                        Make a Comment...
                    </div>
                    <div className="card-body">
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <TextAreaFieldGroup
                                    placeholder="Reply to post"
                                    name="text"
                                    value={this.state.text}
                                    onChange={this.onChange}
                                    error={errors.text}
                                />
                            </div>
                            <button type="submit" className="btn btn-dark">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

CommentForm.propTypes = {
    postId: PropTypes.string.isRequired,
    addComment: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { addComment, clearErrors }
)(CommentForm);
