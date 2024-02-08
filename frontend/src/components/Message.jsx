import "./message.css";

// eslint-disable-next-line react/prop-types
const Message = ({msg, type}) => {
  return (
    <div className={`message ${type}`}>
        <p>{msg}</p>
    </div>
  );
};

export default Message;