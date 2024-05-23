import React from 'react';
// import { BarChart } from 'mui-charts'; // Ensure you have the correct import for BarChart
import { BarChart } from '@mui/x-charts/BarChart';
import PropTypes from 'prop-types';

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

const countBlogPostsPerMonth = (data) => {
    const counts = Array(12).fill(0); // Initialize an array with 12 zeros for each month
    data.forEach(blog => {
        const month = new Date(blog.createdAt).getMonth(); // Get the month index (0-11)
        counts[month] += 1; // Increment the count for the corresponding month
    });
    return counts;
};

const BlogPostsBarChart = ({allBlogData}) => {
    console.log(allBlogData);
    const blogPostsData = [{ data: countBlogPostsPerMonth(allBlogData) }];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <BarChart
            display="block"
            series={blogPostsData}
            height={290}
            xAxis={[{ data: months, scaleType: 'band' }]}
            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
        />
    );
};
BlogPostsBarChart.propTypes = {
    allBlogData: PropTypes.array.isRequired,
};
export default BlogPostsBarChart;
