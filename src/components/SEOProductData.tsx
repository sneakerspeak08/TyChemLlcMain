import { useProducts } from "@/hooks/useProducts";

// This component renders product data in the HTML for SEO purposes
// It's hidden from users but visible to search engines
const SEOProductData = () => {
  const products = useProducts();

  return (
    <div style={{ display: 'none' }} aria-hidden="true">
      {/* Structured data for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Tychem LLC Chemical Products",
            "description": "Surplus chemicals available from Tychem LLC",
            "itemListElement": products.map((product, index) => ({
              "@type": "Product",
              "position": index + 1,
              "name": product.name,
              "description": product.description,
              "offers": {
                "@type": "Offer",
                "availability": "https://schema.org/InStock",
                "seller": {
                  "@type": "Organization",
                  "name": "Tychem LLC"
                }
              }
            }))
          })
        }}
      />
      
      {/* Hidden product content for SEO crawling */}
      <div className="seo-product-data">
        <h1>Tychem LLC Chemical Products</h1>
        <p>Surplus chemical broker offering high-quality industrial chemicals</p>
        {products.map((product) => (
          <div key={product.id} className="seo-product">
            <h2>{product.name}</h2>
            <p>Quantity: {product.quantity}</p>
            <p>{product.description}</p>
            <p>Available from Tychem LLC - Surplus Chemical Brokers</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SEOProductData;