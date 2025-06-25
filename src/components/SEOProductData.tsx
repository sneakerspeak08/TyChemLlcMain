import { useProducts } from "@/hooks/useProducts";

// This component renders product data in the HTML for SEO purposes
// It's hidden from users but visible to search engines
const SEOProductData = () => {
  const products = useProducts();

  return (
    <>
      {/* Structured data for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Tychem LLC Chemical Products",
            "description": "Surplus industrial chemicals available from Tychem LLC",
            "numberOfItems": products.length,
            "itemListElement": products.map((product, index) => ({
              "@type": "Product",
              "position": index + 1,
              "name": product.name,
              "description": product.description,
              "category": "Industrial Chemicals",
              "brand": {
                "@type": "Brand",
                "name": "Tychem LLC"
              },
              "offers": {
                "@type": "Offer",
                "availability": "https://schema.org/InStock",
                "priceCurrency": "USD",
                "seller": {
                  "@type": "Organization",
                  "name": "Tychem LLC",
                  "url": "https://tychem.net"
                }
              },
              "manufacturer": {
                "@type": "Organization",
                "name": "Various"
              }
            }))
          })
        }}
      />
      
      {/* Hidden product content for SEO crawling */}
      <div style={{ display: 'none' }} aria-hidden="true" className="seo-content">
        <h1>Tychem LLC - Surplus Chemical Brokers</h1>
        <h2>Industrial Chemical Products Available</h2>
        <p>Tychem LLC has been a leading surplus chemical broker since 2001, specializing in buying and selling industrial chemicals worldwide. We offer environmental solutions by helping companies dispose of unwanted chemicals responsibly while generating revenue.</p>
        
        <h3>Available Chemical Products:</h3>
        {products.map((product) => (
          <div key={product.id} className="seo-product">
            <h4>{product.name} - Industrial Chemical</h4>
            <p><strong>Quantity Available:</strong> {product.quantity}</p>
            <p><strong>Description:</strong> {product.description}</p>
            <p><strong>Supplier:</strong> Tychem LLC - Surplus Chemical Brokers</p>
            <p><strong>Contact:</strong> ty@tychem.net | 561-357-3200</p>
            <p><strong>Location:</strong> Clover, SC 29710</p>
            <p><strong>Keywords:</strong> {product.name.toLowerCase()}, industrial chemicals, surplus chemicals, chemical broker, chemical disposal, environmental solutions</p>
          </div>
        ))}
        
        <h3>Why Choose Tychem LLC?</h3>
        <ul>
          <li>Over 20 years of experience in chemical brokerage</li>
          <li>Global export capabilities to all major world ports</li>
          <li>Environmental solutions for chemical waste disposal</li>
          <li>Competitive pricing for surplus chemical inventory</li>
          <li>Family-owned business with personal attention</li>
          <li>FOB warehouse pickup available</li>
          <li>Certificates of analysis provided</li>
          <li>Quality assurance and testing services</li>
        </ul>
        
        <h3>Industries Served:</h3>
        <ul>
          <li>Chemical Manufacturing</li>
          <li>Pharmaceutical Companies</li>
          <li>Food and Beverage Industry</li>
          <li>Cosmetics and Personal Care</li>
          <li>Cleaning Products Manufacturing</li>
          <li>Water Treatment Facilities</li>
          <li>Paper and Pulp Industry</li>
          <li>Textile Manufacturing</li>
        </ul>
        
        <h3>Services:</h3>
        <ul>
          <li>Surplus chemical purchasing</li>
          <li>Chemical inventory liquidation</li>
          <li>Environmental waste solutions</li>
          <li>International chemical export</li>
          <li>Chemical trading and brokerage</li>
          <li>Warehouse pickup services</li>
          <li>Quality testing and certification</li>
        </ul>
      </div>
    </>
  );
};

export default SEOProductData;