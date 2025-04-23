// ModalWrapper.jsx

const ModalWrapper = ({ children, onClickOutside }) => {
    return (
      <div
        onClick={onClickOutside}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()} // מונע סגירה כשנלחץ בתוך התוכן
          style={{
            backgroundColor: "white",
            borderRadius: "0.75rem",
            padding: "2rem",
            minWidth: "400px",
            maxWidth: "600px",
            boxShadow: "0 0 20px rgba(0,0,0,0.2)",
          }}
        >
          {children}
        </div>
      </div>
    );
  };
  
  export default ModalWrapper;
  