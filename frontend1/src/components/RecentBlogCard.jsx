// components/RecentBlogCard.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { Card, Box, Typography, CardContent, CardActions, Button, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Like_Dislike from './Like_Dislike';

const RecentBlogCard = ({ blog, userId, blogParam, setRefresh }) => {
    const navigate = useNavigate();
    const handleReadClick = (blogId) => {
        window.scrollTo(0, 0);
        navigate(`/blog/${blogId}`);
      };
    return (
        <Card key={blog._id} sx={{
            borderRadius:"8px",

            width: "100%", maxWidth: 300, marginBottom: "20px", minWidth: 200,
            padding: "15px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, .3)",
            display: "inline-block"
        }}>
            <Box mb={2}>
                <Chip size="large" label={blog.category} />
            </Box>
            <Typography variant="h5"  fontWeight={"600"} mb={1}>
                <div style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                }}>
                    {blog.title}
                </div>
            </Typography>
            <div>
                <img
                    src={blog.image}
                    alt="green iguana"
                    height="100"
                    width="100%"
                />
            </div>
            <CardContent>
                {/* Add any content if needed */}
            </CardContent>
            <CardActions>
                <Like_Dislike blog={blog} setRefresh={setRefresh} />
                <Button size="small" variant="contained" 
                // onClick={() => navigate(`/blog/${blog._id}`)}
                onClick={() => handleReadClick(blog._id)}

                >Read</Button>
                {/* {userId === blog.authorId && blogParam && (
                    <Button size="small" variant="contained" onClick={() => navigate(`/addblog`, { state: blog })}>
                        Edit
                    </Button>
                )} */}
            </CardActions>
        </Card>
    );
};

RecentBlogCard.propTypes = {
    blog: PropTypes.shape({
        _id: PropTypes.string,
        authorId: PropTypes.string.isRequired,
        user_name: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
    }).isRequired,
    userId: PropTypes.string,
    blogParam: PropTypes.any,
    setRefresh: PropTypes.func.isRequired,
};

export default RecentBlogCard;
