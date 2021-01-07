import React from "react";

export const ConnectButton = ({
  account,
  isDropdownOpen,
  setConnection,
  setDisconnection,
}) => {
  let title;
  if (account !== null) {
    let pt1 = account.slice(0, 3);
    let pt2 = account.slice(-4);
    title = `Connected: ${pt1}...${pt2}`;
  } else {
    title = "Connect wallet";
  }
  return (
    <div className="connect-container">
      <button className="connect-button" onClick={setConnection}>
        {title}
      </button>
      {isDropdownOpen && (
        <button className="disconnect-button" onClick={setDisconnection}>
          Disconnect
        </button>
      )}
    </div>
  );
};
