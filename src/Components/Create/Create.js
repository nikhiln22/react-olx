import React, { Fragment, useContext, useState } from 'react';
import './Create.css';
import Header from '../Header/Header';
import { FirebaseContext, AuthContext } from '../../store/Context';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Create = () => {
  const { firebase } = useContext(FirebaseContext);
  const { user } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!category.trim()) {
      toast.error("Category is required");
      return false;
    }
    if (!price || isNaN(price) || price <= 0) {
      toast.error("Valid price is required");
      return false;
    }
    if (!image) {
      toast.error("Image is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const data = new FormData();
    data.append("file", image);
    data.append('upload_preset', "first_name_using_cloudinary");
    data.append('cloud_name', "dv3oqdsdb");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dv3oqdsdb/image/upload", {
        method: "POST",
        body: data
      });

      if (!res.ok) {
        toast.error("Failed to upload image to Cloudinary");
        return;
      }

      const uploadedImageURL = await res.json();
      const imageURL = uploadedImageURL.secure_url;

      const productData = {
        name,
        category,
        price,
        imageURL,
        userID: user?.uid,
        createdAt: serverTimestamp(),
      };

      const db = getFirestore(firebase);
      const productsCollection = collection(db, 'products');
      await addDoc(productsCollection, productData);

      toast.success("Product successfully added!");
      setTimeout(() => navigate('/'), 2000); // Redirect after a delay
    } catch (error) {
      toast.error("Error during the submission process");
      console.error("Error:", error);
    }
  };

  return (
    <Fragment>
      <Header />
      <card>
        <div className="centerDiv">
          <label htmlFor="fname">Name</label>
          <br />
          <input
            className="input"
            type="text"
            id="fname"
            onChange={(e) => setName(e.target.value)}
            name="Name"
            value={name}
          />
          <br />
          <label htmlFor="category">Category</label>
          <br />
          <input
            className="input"
            type="text"
            id="category"
            onChange={(e) => setCategory(e.target.value)}
            name="category"
            value={category}
          />
          <br />
          <label htmlFor="price">Price</label>
          <br />
          <input
            className="input"
            type="number"
            id="price"
            onChange={(e) => setPrice(e.target.value)}
            name="Price"
            value={price}
          />
          <br />
          <br />
          <img alt="Posts" width="200px" height="200px" src={image ? URL.createObjectURL(image) : ''}></img>
          <br />
          <input
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
            type="file"
          />
          <br />
          <button onClick={handleSubmit} className="uploadBtn">
            Upload and Submit
          </button>
        </div>
      </card>
      <ToastContainer position="top-center" autoClose={3000} />
    </Fragment>
  );
};

export default Create;
