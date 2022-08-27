import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewComment = (props) => {
    const { postID, commentID, showNewCommentFieldProp} = props;
    const [comment, setComment] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        axios.post(`http://localhost:8000/api/comments/${postID}/new`, {comment}, {withCredentials: true})
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(`err is: ${err}`);
                setErrors(err.response.data.errors);
                return errors
            });
        hideNewCommentField()
        navigate('/home')

    };

    const hideNewCommentField = () => {
        showNewCommentFieldProp()
    }

    return(
        <form onSubmit={submitHandler}>
            <textarea name="commentBody" onChange={(e) => setComment(e.target.value)}></textarea>
            <div className='d-flex justify-content-around'>
                <button type='submit' className="btn btn-primary">Submit</button>
                <button type='button' onClick={hideNewCommentField}  className="btn btn-primary">Cancel</button>
            </div>
        </form>
    );
};

export default NewComment