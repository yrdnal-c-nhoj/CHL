import React from 'react';
import ClockResults from '../components/ClockResults';
import Footer from '../components/Footer';
import TopNav from '../components/TopNav';
import { useDataContext } from '../context/DataContext';
import listStyles from '../styles/ClockList.module.css';

const ListPage: React.FC = () => {
  const { items, loading, error } = useDataContext();

  return (
    <div className={listStyles.listPageContainer}>
      <TopNav />
      <ClockResults items={items} loading={loading} error={error} />
      <Footer />
    </div>
  );
};

export default ListPage;