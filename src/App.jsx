import PropTypes from "prop-types";
import { useState } from "react";

const initialFriends = [
  {
    id: "118836",
    name: "Clark",
    image: "3.jpg",
    balance: -7,
  },
  {
    id: "933372",
    name: "Sarah",
    image: "1.jpg",
    balance: 20,
  },
  {
    id: "499476",
    name: "Anthony",
    image: "2.jpg",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button
      className="px-4 py-2 ml-16 font-bold text-black bg-yellow-500 rounded hover:bg-yellow-700"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    //setSelectedFriend(friend);
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  return (
    <>
      <div className="font-bold app">
        <div className="sidebar">
          <FriendsList
            friends={friends}
            selectedFriend={selectedFriend}
            onSelection={handleSelection}
          />
          <div className="bg-yellow-100">
            {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
          </div>
          <div className="ml-96">
            <Button onClick={handleShowAddFriend}>
              {showAddFriend ? "Close" : "AddFriend"}
            </Button>
          </div>
        </div>

        <div className="p-6 mb-64 bg-yellow-100 ml-80">
          {selectedFriend && (
            <FormSplitBill
              selectedFriend={selectedFriend}
              onSplitBill={handleSplitBill}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default App;

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
        />
      ))}
    </ul>
  );
}

FriendsList.propTypes = {
  friends: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      balance: PropTypes.number.isRequired,
    })
  ).isRequired,
  selectedFriend: PropTypes.object,
  onSelection: PropTypes.func.isRequired,
};

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend && selectedFriend?.id === friend.id;

  return (
    <li
      className={`flex items-center pt-4 pb-4 pl-6 pr-6 mb-6 mr-6 rounded hover:bg-yellow-200 ${
        isSelected ? "selected bg-yellow-300" : ""
      }`}
      onClick={() => onSelection(friend)}
    >
      <img
        src={friend.image}
        alt={friend.name}
        className="w-24 h-24 mr-4 overflow-hidden rounded-full"
      />
      <div className="flex-1 ml-8 mr-4">
        <h3 className="mb-2">{friend.name}</h3>

        {friend.balance < 0 && (
          <p className="mb-1 text-red-500">
            You owe {friend.name} {Math.abs(friend.balance)}$
          </p>
        )}
        {friend.balance > 0 && (
          <p className="mb-1 text-green-500">
            {friend.name} owes you {Math.abs(friend.balance)}$
          </p>
        )}
        {friend.balance === 0 && (
          <p className="mb-1">You and {friend.name} are even</p>
        )}
      </div>
      <div>
        <Button>{isSelected ? "Close" : "Select"}</Button>
      </div>
    </li>
  );
}

Friend.propTypes = {
  friend: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    balance: PropTypes.number.isRequired,
  }).isRequired,
  selectedFriend: PropTypes.object,
  onSelection: PropTypes.func.isRequired,
};

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("http://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      name,
      image: `${image}?${id}`,
      balance: 0,
      id,
    };

    onAddFriend(newFriend);

    setName("");
    setImage("http://i.pravatar.cc/48");
  }

  return (
    <form
      className="items-center pt-4 pb-4 pl-6 pr-6 mb-6 mr-6 "
      onSubmit={handleSubmit}
    >
      <label>🧏‍♂️ Friend name :</label>
      <input
        type="text"
        className="ml-4"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <br />
      <label>🎬 Image URL :</label>
      <input
        type="text"
        className="ml-7"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <br />
      <br />
      <div className="ml-32">
        <Button>Add</Button>
      </div>
    </form>
  );
}

FormAddFriend.propTypes = {
  onAddFriend: PropTypes.func.isRequired,
};

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-4xl font-bold">
        Split a bill with {selectedFriend.name}
      </h2>

      <br />
      <br />
      <label>💰 Bill Value :</label>
      <input
        type="number"
        className="ml-11"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <br />
      <br />
      <label>🙎‍♂️ Your expense :</label>
      <input
        type="number"
        className="ml-4"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <br />
      <br />
      <label>🧏‍♂️ {selectedFriend.name}&apos;s expense :</label>
      <input type="number" className="ml-7" disabled value={paidByFriend} />

      <br />
      <br />
      <label>🤑 Who is paying the bill :</label>
      <select
        className="ml-7"
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <br />
      <br />

      <div className="ml-32">
        <Button type="submit">Split bill</Button>
      </div>
    </form>
  );
}

FormSplitBill.propTypes = {
  selectedFriend: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    balance: PropTypes.number.isRequired,
  }).isRequired,
  onSplitBill: PropTypes.func.isRequired,
};
