import styles from './Home.module.css';
import { ReactComponent as RoletaSvg } from '../assets/roleta.svg';
import Roleta from './Roleta';

const Home = () => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.headerContainer}>
        <RoletaSvg />
        <h1 className={styles.title}>A incrivel roleta dos indecisos</h1>
        <RoletaSvg />
      </div>
      <div className={styles.contentContainer}>
        <Roleta />
      </div>
    </div>
  );
};

export default Home;
