import Layout from "@/components/Layout";
import { MainTextStyle, MainTextColor } from "@/components/style";
import { Center, Text } from "@chakra-ui/react";
export default function Home() {
  return (
    <Layout>
      <Text sx={MainTextStyle} 
            textColor={MainTextColor}
            fontSize={"3xl"}>
        WELCOME !
      </Text>
    </Layout>
  );
}
