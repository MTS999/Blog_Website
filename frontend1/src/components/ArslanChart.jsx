import React from 'react';
import { BarChart } from '@mui/x-charts';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

// Sample blogData
const blogData = [
    { userId: 4, taskContent: 'task 5', taskDate: '2024-05-26T13:09:50', status: 'done' },
    { userId: 4, taskContent: 'task 6', taskDate: '2024-05-26T13:09:56', status: 'pending' },
    { userId: 4, taskContent: 'task 7', taskDate: '2024-05-26T13:10:01', status: 'pending' },
    { userId: 4, taskContent: 'task 8', taskDate: '2024-05-26T13:12:13', status: 'pending' },
    { userId: 4, taskContent: 'teeeteisnfs', taskDate: '2024-06-10T01:20:42', status: 'pending' },
    { userId: 4, taskContent: 'task done', taskDate: '2024-06-10T21:43:13', status: 'done' }
];

const countCompletionPercentagePerWeek = (data) => {
    const weeksInYear = 52;
    const totalCounts = Array(weeksInYear).fill(0); // Total tasks per week
    const completedCounts = Array(weeksInYear).fill(0); // Completed tasks per week

    blogData.forEach(blog => {
        const week = getWeekOfYear(new Date(blog.taskDate)); // Get the week index (1-52)
        totalCounts[week - 1] += 1; // Increment the total count for the corresponding week
        if (blog.status === 'done') {
            completedCounts[week - 1] += 1; // Increment the completed count for the corresponding week
        }
    });

    return totalCounts.map((total, i) => (total === 0 ? 0 : (completedCounts[i] / total) * 100));
};

// Helper function to get the week of the year
const getWeekOfYear = (date) => {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startDate.getDay() + 1) / 7);
};

const ArslanChart = ({ allBlogData }) => {
    const completionData = countCompletionPercentagePerWeek(allBlogData);
    const weeks = Array.from({ length: 52 }, (_, i) => `Week ${i + 1}`);

    return (
        <>
            <BarChart
                display="block"
                series={[{ data: completionData }]}
                height={290}
                xAxis={[{ data: weeks, scaleType: 'band' }]}
                margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
            >
                {/* <Bar
                    label={(dataPoint) => `${dataPoint.toFixed(1)}%`} // Format the label
                    labelPosition="top" // Position the label on top of the bar
                /> */}
            </BarChart>
            <Typography variant="h3">Blog Chart</Typography>
        </>
    );
};

ArslanChart.propTypes = {
    allBlogData: PropTypes.array.isRequired,
};

export default ArslanChart;
