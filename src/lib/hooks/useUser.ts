"use client";

import { useState, useEffect } from 'react';


export function useUser() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let id = localStorage.getItem('manasutra_user_id');
    if (!id) {
      // Create a unique ID if it doesn't exist
      id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
      localStorage.setItem('manasutra_user_id', id);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUserId(id);
  }, []);

  return userId;
}
