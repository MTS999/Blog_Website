import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

// Sample blogData
const blogData = [
    { id: 1, title: "How to learn JavaScript in 2023", category: "JavaScript", published: "2023-01-15" },
    { id: 2, title: "Understanding React Hooks", category: "React", published: "2023-02-20" },
    { id: 3, title: "Advanced CSS Techniques", category: "CSS", published: "2023-02-25" },
    { id: 4, title: "Mastering Python", category: "Python", published: "2023-03-05" },
    { id: 5, title: "Django for Beginners", category: "Python", published: "2023-03-10" },
    { id: 6, title: "Data Analysis with Pandas", category: "Data Science", published: "2023-04-15" },
    { id: 7, title: "Introduction to TensorFlow", category: "Data Science", published: "2023-04-20" },
    { id: 8, title: "Building REST APIs with Node.js", category: "JavaScript", published: "2023-05-01" },
    { id: 9, title: "Getting Started with TypeScript", category: "TypeScript", published: "2023-05-15" },
    { id: 10, title: "Vue.js Essentials", category: "Vue", published: "2023-05-20" },
];


const countBlogPostsPerWeek = (data) => {
      console.log(data);
    const weeksInYear = 52;
    const counts = Array(weeksInYear).fill(0); // Initialize an array with 52 zeros for each week

    data.forEach(blog => {
        const week = getWeekOfYear(new Date(blog.createdAt)); // Get the week index (1-52)
        counts[week - 1] += 1; // Increment the count for the corresponding week (adjust for 0-based index)
    });

    return counts;
};

// Helper function to get the week of the year
const getWeekOfYear = (date) => {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startDate.getDay() + 1) / 7);
};

const BlogPostsBarChart = ({ allBlogData }) => {
    console.log(allBlogData);
    const blogPostsData = [{ data: countBlogPostsPerWeek(allBlogData) }];
    const weeks = Array.from({ length: 52 }, (_, i) => `Week ${i + 1}`);

    return (
        <>
            <BarChart
                display="block"
                series={blogPostsData}
                height={290}
                xAxis={[{ data: weeks, scaleType: 'band' }]}
                margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
            />
            <Typography variant="h4" fontWeight={"bold"}>Blog Chart</Typography>
        </>
    );
};

BlogPostsBarChart.propTypes = {
    allBlogData: PropTypes.array.isRequired,
};

export default BlogPostsBarChart;
