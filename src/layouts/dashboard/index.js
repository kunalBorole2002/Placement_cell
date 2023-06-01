import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import MiniStatisticsCard from 'examples/Cards/StatisticsCards/MiniStatisticsCard';
import ReportsBarChart from 'examples/Charts/BarCharts/ReportsBarChart';
import GradientLineChart from 'examples/Charts/LineCharts/GradientLineChart';
import typography from 'assets/theme/base/typography';
import getReportsBarChartData from './data/reportsBarChartData';
import getGradientLineChartData from './data/gradientLineChartData';
import LoadingScreen from './LoadingScreen';

function Dashboard() {
    const { size } = typography;
    const { average, gradientLineChartData, lastyear } = getGradientLineChartData();
    const { chart, items, average1 } = getReportsBarChartData();
    const [count, setCount] = useState(null);
    const [placedCount, setPlacedCount] = useState(null);
    const [unplacedCount, setUnplacedCount] = useState(null);
    const [companyCount, setCompanyCount] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('http://localhost:3001/api/students/count').then((response) => response.json()),
            fetch('http://localhost:3001/api/companies/count').then((response) => response.json()),
        ])
            .then(([studentsData, companiesData]) => {
                setCount(studentsData.count);
                setPlacedCount(studentsData.placedCount);
                setUnplacedCount(studentsData.unplacedCount);
                setCompanyCount(companiesData.c_count);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox py={3}>
                <SoftBox mb={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} xl={3}>
                            <MiniStatisticsCard
                                title={{ text: 'total students' }}
                                count={count}
                                percentage={{ color: 'success', text: '' }}
                                icon={{ color: 'primary', component: 'paid' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} xl={3}>
                            <MiniStatisticsCard
                                title={{ text: 'placed students' }}
                                count={placedCount}
                                percentage={{ color: 'success', text: `${((placedCount / count) * 100).toFixed(0)}%` }}
                                icon={{ color: 'primary', component: 'public' }}
                            />

                        </Grid>
                        <Grid item xs={12} sm={6} xl={3}>
                            <MiniStatisticsCard
                                title={{ text: 'companies' }}
                                count={companyCount}
                                percentage={{ color: 'error', text: '' }}
                                icon={{ color: 'primary', component: 'emoji_events' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} xl={3}>
                            <MiniStatisticsCard
                                title={{ text: 'remaining' }}
                                count={unplacedCount}
                                percentage={{ color: 'error', text: `${((unplacedCount / count) * 100).toFixed(0)}%` }}
                                icon={{
                                    color: 'primary',
                                    component: 'shopping_cart',
                                }}
                            />
                        </Grid>
                    </Grid>
                </SoftBox>
                <SoftBox mb={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} lg={5}>
                            <ReportsBarChart
                                title="active students"
                                description={
                                    <>
                                        (<strong>+{average1}%</strong>) than last {lastyear}
                                    </>
                                }
                                chart={chart}
                                items={items}
                            />
                        </Grid>
                        <Grid item xs={12} lg={7}>
                            <GradientLineChart
                                title="Placement Overview"
                                description={
                                    <SoftBox display="flex" alignItems="center">
                                        <SoftBox fontSize={size.lg} color="success" mb={0.3} mr={0.5} lineHeight={0}>
                                            <Icon className="font-bold">arrow_upward</Icon>
                                        </SoftBox>
                                        <SoftTypography variant="button" color="text" fontWeight="medium">
                                            {average}% more{" "}
                                            <SoftTypography variant="button" color="text" fontWeight="regular">
                                                in {lastyear}
                                            </SoftTypography>
                                        </SoftTypography>
                                    </SoftBox>
                                }
                                height="20.25rem"
                                chart={gradientLineChartData}
                            />
                        </Grid>
                    </Grid>
                </SoftBox>
            </SoftBox>
        </DashboardLayout>
    );
}

export default Dashboard;
