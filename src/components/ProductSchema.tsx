import { Chemical } from "@/data/products";

interface ProductSchemaProps {
  product: Chemical;
}

const ProductSchema = ({ product }: ProductSchemaProps) => {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.category,
    manufacturer: {
      "@type": "Organization",
      name: product.manufacturer
    },
    identifier: [
      {
        "@type": "PropertyValue",
        propertyID: "cas",
        value: product.cas
      }
    ],
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Purity",
        value: product.purity
      },
      {
        "@type": "PropertyValue",
        name: "Location",
        value: product.location
      },
      {
        "@type": "PropertyValue",
        name: "Quantity",
        value: product.quantity
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default ProductSchema;