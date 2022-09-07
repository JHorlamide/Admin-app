import Layout from '@/components/Layout';
import type { NextPage } from 'next';
import Dashboard from '@/components/Dashboard';

const Home: NextPage = () => {
  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
};

export default Home;
