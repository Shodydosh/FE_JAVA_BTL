'use client';
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { 
    ShoppingCartOutlined, 
    StarOutlined, 
    UserOutlined, 
    DollarOutlined 
} from '@ant-design/icons';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const { Title: TitleAnt } = Typography;

const AdminStatistics = () => {
    const [statistics, setStatistics] = useState({
        totalOrders: 0,
        averageRating: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        monthlyOrders: [],
        productRatings: []
    });

    useEffect(() => {
        // Fetch statistics from your API
        const fetchStatistics = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/admin/statistics');
                const data = await response.json();
                setStatistics(data);
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };

        fetchStatistics();
    }, []);

    const monthlyOrdersData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Monthly Orders',
                data: statistics.monthlyOrders,
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    const ratingData = {
        labels: ['1★', '2★', '3★', '4★', '5★'],
        datasets: [
            {
                label: 'Product Ratings',
                data: statistics.productRatings,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    return (
        <div className="p-6">
            <TitleAnt level={2}>Dashboard Statistics</TitleAnt>
            
            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Orders"
                            value={statistics.totalOrders}
                            prefix={<ShoppingCartOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Average Rating"
                            value={statistics.averageRating}
                            precision={1}
                            prefix={<StarOutlined />}
                            suffix="/5"
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Revenue"
                            value={statistics.totalRevenue}
                            prefix={<DollarOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Customers"
                            value={statistics.totalCustomers}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                    <Card>
                        <TitleAnt level={4}>Monthly Orders</TitleAnt>
                        <Bar data={monthlyOrdersData} />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card>
                        <TitleAnt level={4}>Rating Distribution</TitleAnt>
                        <Line data={ratingData} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminStatistics;