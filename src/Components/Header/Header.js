import React, { useContext } from 'react';

import './Header.css';
import OlxLogo from '../../assets/OlxLogo';
import Search from '../../assets/Search';
import Arrow from '../../assets/Arrow';
import SellButton from '../../assets/SellButton';
import SellButtonPlus from '../../assets/SellButtonPlus';
import { AuthContext, FirebaseContext } from '../../store/Context';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
function Header() {
  const { user } = useContext(AuthContext)
  const { firebase } = useContext(FirebaseContext)
  const navigate = useNavigate();
  return (
    <div className="headerParentDiv">
      <div className="headerChildDiv">
        <div className="brandName">
          <OlxLogo></OlxLogo>
        </div>
        <div className="placeSearch">
          <Search></Search>
          <input type="text" />
          <Arrow></Arrow>
        </div>
        <div className="productSearch">
          <div className="input">
            <input
              type="text"
              placeholder="Find car,mobile phone and more..."
            />
          </div>
          <div className="searchAction">
            <Search color="#ffffff"></Search>
          </div>
        </div>
        <div className="language">
          <span> ENGLISH </span>
          <Arrow></Arrow>
        </div>
        <div className="loginPage">
          <span>{user && `Welcome ${user.email}`}</span>
          <hr />
        </div>

        {user ? <span onClick={() => {
          const auth = getAuth();
          signOut(auth).then(() => {
            navigate('/login')
          }).catch((error) => {
            alert('oops...error occured while logging out')
          });
        }}>Logout</span> : <span onClick={() => { navigate('/login') }}>Login</span>}

        <div className="sellMenu">
          <SellButton></SellButton>
          <div className="sellMenuContent">
            <SellButtonPlus></SellButtonPlus>
            <span onClick={() => navigate('/create')}>SELL</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
