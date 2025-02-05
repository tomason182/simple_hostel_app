import Card from "../../components/Card";
import styles from "./Home.module.css";

export default function Home() {
  function handleClick() {
    console.log("Button Clicked");
  }

  const actions = [
    {
      label: "SHOW MORE",
      onClick: () => handleClick(),
    },
    {
      label: "EDIT",
      onClick: () => handleClick(),
    },
  ];

  const children = (
    <ul>
      <li>First item</li>
      <li>Second item</li>
    </ul>
  );

  return (
    <div className={styles.container}>
      <Card title="Who's coming today" actions={actions}>
        {children}
      </Card>
      <Card title="Who's leaving today" actions={actions}>
        {children}
      </Card>
      <Card title="Latest reservations" actions={actions}>
        {children}
      </Card>
    </div>
  );
}
