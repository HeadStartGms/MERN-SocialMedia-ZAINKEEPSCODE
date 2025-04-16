import React, { useState, useCallback } from "react";
import "./Post.css";
import Comment from "../../img/comment.png";
import Share from "../../img/share.png";
import Heart from "../../img/like.png";
import NotLike from "../../img/notlike.png";
import { likePost } from "../../api/PostsRequests";
import { useSelector } from "react-redux";

const Post = ({ data }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const [liked, setLiked] = useState(data.likes.includes(user._id));
  const [likes, setLikes] = useState(data.likes.length);

  const handleLike = useCallback(async () => {
    try {
      setLiked((prev) => !prev);
      liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1);

      // API call to like/unlike post
      await likePost(data._id, user._id);
    } catch (error) {
      console.error("Failed to like the post:", error);

      // Revert the optimistic update in case of an error
      setLiked((prev) => !prev);
      liked ? setLikes((prev) => prev + 1) : setLikes((prev) => prev - 1);
    }
  }, [liked, data._id, user._id]);

  return (
    <div className="Post">
      {data.image && (
        <img
          src={process.env.REACT_APP_PUBLIC_FOLDER + data.image}
          alt="Post"
        />
      )}

      <div className="postReact">
        <img
          src={liked ? Heart : NotLike}
          alt={liked ? "Liked" : "Not Liked"}
          style={{ cursor: "pointer" }}
          onClick={handleLike}
        />
        <img src={Comment} alt="Comment" />
        <img src={Share} alt="Share" />
      </div>

      <span style={{ color: "var(--gray)", fontSize: "12px" }}>
        {likes} {likes === 1 ? "like" : "likes"}
      </span>
      <div className="detail">
        <span>
          <b>{data.name} </b>
        </span>
        <span>{data.desc}</span>
      </div>
    </div>
  );
};

export default Post;