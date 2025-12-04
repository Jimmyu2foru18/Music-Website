import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Loader } from 'lucide-react';
import { searchMusic } from '../services/api';
import { SongCard } from '../components/SongCard';
import { Song } from '../types';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      searchMusic(query).then(data => {
        setResults(data);
        setLoading(false);
      });
    }
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <SearchIcon className="text-red-500" />
            Search Results
        </h1>
        <p className="text-gray-400">
            Showing results for: <span className="text-white font-bold">"{query}"</span>
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
            <Loader className="animate-spin text-red-500" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((song, idx) => (
                <SongCard key={song.id + idx} song={song} />
            ))}
            {results.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                    No results found. Try a different search term.
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default Search;
