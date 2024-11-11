import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GetUserDataComponent.css';

interface Location {
  city: string;
  country: string;
}

interface Name {
  title: string;
  first: string;
  last: string;
}

interface Picture {
  medium: string;
}

interface User {
  name: Name;
  email: string;
  location: Location;
  picture: Picture;
}

interface UserCardProps {
  user: User;
}

interface ApiResponse {
  results: User[];
}

const UserCard: React.FC<UserCardProps> = ({ user }) => (
  <article className="user-card">
    <div className="user-info">
      <img 
        src={user.picture.medium} 
        alt={`${user.name.first} ${user.name.last}`}
        className="user-avatar"
      />
      <div className="user-details">
        <h3 className="user-name">
          {user.name.title}. {user.name.first} {user.name.last}
        </h3>
        <p className="user-text">{user.email}</p>
        <p className="user-text">
          {user.location.city}, {user.location.country}
        </p>
      </div>
    </div>
  </article>
);

const UserIcon: React.FC = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    className="user-icon"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const GetUserDataComponent: React.FC = () => {
  const [userData, setUserData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getUserData = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get('https://randomuser.me/api/');
      if (!response.data) {
        throw new Error('Failed to fetch user data');
      }

      const data: ApiResponse = response.data;
      setUserData(prevData => [...prevData, data.results[0]]);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <main className="container">
      <div className="header">
        <h2 className="title">User List</h2>
        <button 
          onClick={getUserData} 
          className={`add-button ${isLoading ? 'loading' : ''}`}
          type="button"
          disabled={isLoading}
        >
          <UserIcon />
          {isLoading ? 'Loading...' : 'Add Random User'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <section className="user-list">
        {userData.map((user, index) => (
          <UserCard 
            key={`${index}-${user.email}`} 
            user={user} 
          />
        ))}
      </section>
    </main>
  );
};

export default GetUserDataComponent;