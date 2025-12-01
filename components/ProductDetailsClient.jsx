"use client";

import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaUser, FaChartBar, FaWordpressSimple } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

export default function ProductDetailsClient({ product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const router=useRouter()

  const handleAddToCart = () => {
    const added = addToCart({
      id: product.id,
      title: product.title,
      price: product.priceCents,
      quantity,
      cloudinaryId: product.cloudinaryId,
      filename: product.filename,
      logoUrl: product.logoUrl,
    });
   alert(added ? "Added to cart!" : "Already in cart!");
    router.push('/checkout')
  };

  return (
    <div className="page">
      <div className="container">
        {/* Thumbnail */}
        {product.thumbnailUrl ? (
          <img src={product.thumbnailUrl} alt={`${product.title} Thumbnail`} className="thumbnail" />
        ) : (
          <div className="thumbnail-placeholder">No Thumbnail</div>
        )}

        {/* Logo + Title */}
        <div className="header-shop-details">
          {product.logoUrl && <img src={product.logoUrl} className="logo" alt={`${product.title} Logo`} />}
          <h1 className="title-1">{product.title}</h1>
        </div>

       <div className="desc1">
          {product.description ? (
            <ReactMarkdown>{product.description}</ReactMarkdown>
          ) : (
            "No description available."
          )}
        </div>

        {/* Extra info */}
        <div className="extra">
          <div className="row author">
            <FaUser className="icon blue" />
            <span>Author: IndoAge</span>
          </div>
          <div className="row stats">
            <div className="stat">
              <FaChartBar className="icon green" />
              <span>Active Installations: {100 + Math.floor(Math.random() * 900)}+</span>
            </div>
            <div className="stat">
              <FaWordpressSimple className="icon black" />
              <span>Tested with WordPress 6+</span>
            </div>
          </div>
        </div>

        {/* Price + Add to Cart */}
        <div className="price">Price: ₹{product.priceCents}</div>
        <div className="buttons" style={{width:'26%'}}>
          <button className="cart" onClick={handleAddToCart} style={{paddingTop:"13px",paddingBottom:"13px",fontFamily:"Montserrat",fontSize:'16px'}}>Add to Cart</button>
        </div>
      </div>

      <style jsx>{`
      
      `}</style>
    </div>
  );
}
