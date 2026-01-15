"use client";

import { useState, useEffect, useRef } from "react";

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

interface Suggestion {
  place_id: string;
  description: string;
}

export default function AddressInput({ value, onChange, onSubmit }: AddressInputProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSelected, setHasSelected] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      // Skip fetching if user just selected an address
      if (hasSelected) {
        setHasSelected(false);
        return;
      }

      if (value.length < 5) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        // Using Nominatim (OpenStreetMap) - free, no API key required
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            value
          )}&format=json&addressdetails=1&limit=5&countrycodes=us`,
          {
            headers: {
              "Accept-Language": "en-US,en",
            },
          }
        );
        const data = await response.json();
        
        if (data && Array.isArray(data)) {
          const formattedSuggestions = data.map((result: { 
            place_id: number; 
            display_name: string;
            address: {
              house_number?: string;
              road?: string;
              city?: string;
              town?: string;
              village?: string;
              state?: string;
              postcode?: string;
            };
          }) => {
            const addr = result.address;
            const street = [addr.house_number, addr.road].filter(Boolean).join(" ");
            const city = addr.city || addr.town || addr.village || "";
            const state = addr.state || "";
            const zip = addr.postcode || "";
            
            // Format: Street Address, City, State Zip
            const formattedAddress = [
              street,
              city,
              `${state} ${zip}`.trim()
            ].filter(Boolean).join(", ");
            
            return {
              place_id: String(result.place_id),
              description: formattedAddress || result.display_name,
            };
          });
          setSuggestions(formattedSuggestions);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(debounceTimer);
  }, [value, hasSelected]);

  const handleSelect = (suggestion: Suggestion) => {
    setHasSelected(true);
    setSuggestions([]);
    setShowSuggestions(false);
    onChange(suggestion.description);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setShowSuggestions(false);
      onSubmit();
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex bg-white rounded-lg overflow-hidden shadow-lg">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="Start typing your address..."
          className="flex-1 px-4 py-4 text-gray-700 text-base focus:outline-none"
        />
        <button
          onClick={onSubmit}
          disabled={!value}
          className="px-6 py-4 bg-[#3b82f6] text-white font-semibold hover:bg-[#2563eb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Calculate
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              onClick={() => handleSelect(suggestion)}
              className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
            >
              {suggestion.description}
            </button>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg p-4 text-gray-500 text-center">
          Loading suggestions...
        </div>
      )}
    </div>
  );
}
