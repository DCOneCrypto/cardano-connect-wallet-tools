
import { NextPageWithLayout } from "@/models";
import { MainLayout } from "components/layout";
import Typography from '@mui/material/Typography';
import { useWallet } from "@meshsdk/react";


const Home: NextPageWithLayout = () => {
  const {connected} = useWallet();

  return (
    <Typography variant="h5" gutterBottom>
      {
        !connected?'Kết nối với ví để sử dụng':'Có thể gửi nhiều ada, mint, burn, tương tác với sc'
      }
    </Typography>

  );
}
Home.Layout = MainLayout
export default Home