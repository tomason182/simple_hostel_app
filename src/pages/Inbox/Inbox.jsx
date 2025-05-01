import styles from "./Inbox.module.css";

export default function Inbox() {
  return (
    <div className={styles.content}>
      <h1>Inbox</h1>
      <p>Messages</p>
      <div className={styles.buttonContainer}>
        <div></div> {/* Empty container for display flex */}
        <button className={styles.sendButton} disabled>
          Send Message
        </button>
      </div>
      <div>
        <ul className={styles.messagesList}>
          <li>
            This functionality is not yet developed. To contact us please send
            an email to support@simplehostel.net
          </li>
        </ul>
      </div>
    </div>
  );
}
