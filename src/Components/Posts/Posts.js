import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Heart from '../../assets/Heart';
import './Post.css';
import { FirebaseContext } from '../../store/Context';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

function Posts() {
  const { firebase } = useContext(FirebaseContext);
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]); // State for recommendations

  const navigate = useNavigate();

  useEffect(() => {
    const db = getFirestore(firebase); // Initialize Firestore
    const productsCollection = collection(db, 'products'); // Reference to the 'products' collection

    // Fetch all products for Quick Menu
    getDocs(productsCollection)
      .then((snapshot) => {
        const allPost = snapshot.docs.map((product) => ({
          ...product.data(),
          id: product.id,
        }));
        setProducts(allPost);

        // Shuffle and pick a few products randomly as recommendations
        const shuffledProducts = allPost.sort(() => Math.random() - 0.5);
        const selectedRecommendations = shuffledProducts.slice(0, 5); // Pick 5 random products
        setRecommendations(selectedRecommendations);
      })
      .catch((error) => {
        console.error('Error occurred while fetching the products:', error);
      });
  }, [firebase]);

  return (
    <div className="postParentDiv">
      <div className="moreView">
        <div className="heading">
          <span>Quick Menu</span>
          <span>View more</span>
        </div>
        <div className="cards">
          {products.map((product) => {
            const createdAtDate = new Date(product.createdAt.seconds * 1000);
            const formattedDate = createdAtDate.toLocaleDateString();

            return (
              <div className="card" key={product.id}>
                <div className="favorite">
                  <Heart />
                </div>
                <div className="image">
                  <img src={product.imageURL} alt={product.name} />
                </div>
                <div className="content">
                  <p className="rate">&#x20B9; {product.price}</p>
                  <span className="kilometer">{product.category}</span>
                  <p className="name">{product.name}</p>
                </div>
                <div className="date">
                  <span>{formattedDate}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="recommendations">
        <div className="heading">
          <span>Fresh recommendations</span>
        </div>
        <div className="cards">
          {recommendations.map((product) => {
            const createdAtDate = new Date(product.createdAt.seconds * 1000);
            const formattedDate = createdAtDate.toLocaleDateString();

            return (
              <div className="card" key={product.id}>
                <div className="favorite">
                  <Heart />
                </div>
                <div className="image">
                  <img src={product.imageURL} alt={product.name} />
                </div>
                <div className="content">
                  <p className="rate">&#x20B9; {product.price}</p>
                  <span className="kilometer">{product.category}</span>
                  <p className="name">{product.name}</p>
                </div>
                <div className="date">
                  <span>{formattedDate}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Posts;
