import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";
import { LATEST_PRODUCTS_LIMIT } from "@/lib/constants";

const Homepage = async () => {
  const latestProducts = await getLatestProducts();

  return (
    <>
      {/* The limit is also set to 4 in lib/actions/product.actions.ts */}
      <ProductList
        data={latestProducts}
        title="Newest Arrivals"
        limit={LATEST_PRODUCTS_LIMIT}
      />
    </>
  );
};

export default Homepage;
