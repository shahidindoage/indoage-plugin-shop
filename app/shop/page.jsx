"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { FaUser, FaChartBar, FaWordpressSimple, FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function ShopPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router=useRouter()

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const res = await fetch("/api/products/list");
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddToCart = (product) => {
    const added = addToCart({
      id: product.id,
      title: product.title,
      price: product.priceCents,
      quantity: 1,
      cloudinaryId: product.cloudinaryId,
      filename: product.filename,
      logoUrl: product.logoUrl,
    });
    alert(added ? "Added to cart!" : "Already in cart!");
    router.push('/checkout')
  };

  return (
    <div className="page">

      {/* Search Bar */}
  <div className="search-box">
  <input
    type="text"
    placeholder="Search products..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
  <FaSearch className="search-icon" />
</div>


      {/* Loading State */}
      {loading && (
        <div style={{height:"500px",display:"flex",justifyContent:'center',alignItems:'center'}}><p className="center-text" style={{fontSize:"25px",fontWeight:800}}>Loading products...</p></div> 

      )}

      {/* Only show no results AFTER loading and search applied */}
      {!loading && filteredProducts.length === 0 && search !== "" && (
        <p style={{ textAlign: "center", fontSize: "18px", marginTop: "20px" }}>
          No products found.
        </p>
      )}

      {/* Only show products when loaded */}
      {!loading && (
        <div className="grid">
          {filteredProducts.map((p) => (
            <div className="card" key={p.id}>
              <div className="content">
                <div className="header-shop">
                  {p.logoUrl && (
                    <img src={p.logoUrl} className="logo" alt={`${p.title} logo`} />
                  )}
                  <h2 className="name">{p.title}</h2>
                </div>

                <p className="desc">{p.description || "No description available."}</p>

                <div className="extra">
                  <div className="row author">
                    <FaUser className="icon blue" />
                    <span>Author: IndoAge</span>
                  </div>
                  <div className="row stats">
                    <div className="stat">
                      <FaChartBar className="icon green" />
                      <span>
                        Active Installations: {100 + Math.floor(Math.random() * 900)}+
                      </span>
                    </div>
                    <div className="stat">
                      <FaWordpressSimple className="icon black" />
                      <span>Tested with WordPress 6+</span>
                    </div>
                  </div>
                </div>

                <div className="buttons">
                  <a href={`/shop/${p.id}`} className="view">View</a>
                  <button className="cart" onClick={() => handleAddToCart(p)}>Add</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

     

    </div>
  );
}
