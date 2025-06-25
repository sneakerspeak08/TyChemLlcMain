import { useEffect } from 'react';
import { useProducts } from './useProducts';
import { AutomaticSitemapUpdater } from '@/utils/automaticSitemapUpdater';

export const useSitemapFileUpdater = () => {
  const { products } = useProducts();

  useEffect(() => {
    if (products.length > 0) {
      const updater = AutomaticSitemapUpdater.getInstance();
      updater.updateSitemap(products);
    }
  }, [products]);

  return products;
};