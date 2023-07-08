//NextPageはページコンポーネントを表す型
import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import style from "./index.module.css";

//getServerSidePropsから渡されるpropsの型
type Props = {
  initialImageUrl: string;
}

//ページコンポーネント関数にpropsを受け取る引数を追加する
const IndexPage: NextPage<Props> = ({ initialCatImageUrl }) => {
  const [catImageUrl, setCatImageUrl] = useState(initialCatImageUrl);

  const handleClick = async () => {
    const image = await fetchImage();
    setCatImageUrl(image.url);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        style={{
          backgroundColor: "#319795",
          border: "none",
          borderRadius: "4px",
          color: "white",
          padding: "4px 8px",
        }}
      >
        きょうのにゃんこ🐱
      </button>
      <div style={{ marginTop: 8, maxWidth: 500 }}>
        <img src={catImageUrl} width="100%" height="auto" alt="猫" />
      </div>
    </div>
  );
};

//Next.jsにページコンポーネントと認識させる
export default IndexPage;

//サーバサイドで実行する処理
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const image = await fetchImage();
  return {
    props: {
      initialImageUrl: image.url,
    },
  };
};

type Image = {
  url: string;
};

const fetchImage = async (): Promise<Image> => {
    const res = await fetch("https://api.thecatapi.com/v1/images/search");
    const images: unknown = await res.json();
    //配列として表現されているか？
    if (!Array.isArray(images)) {
      throw new Error("猫の画像が取得できませんでした");
    }
    const image: unknown = images[0];
    //Imageの構造をなしいているか？
    if (!isImage(image)) {
      throw new Error("猫の画像が取得できませんでした");
    }
    return image;
};

//型ガード関数
const isImage = (value: unknown): value is Image => {
  //値がオブジェクトなのか？
  if (!value || typeof value !== "object") {
    return false;
  }
  //urlプロパティが存在し、かつ、それが文字列なのか？
  return "url" in value && typeof value.url === "string";
}

fetchImage();
