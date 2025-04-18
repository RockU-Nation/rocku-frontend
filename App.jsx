import React, { useState } from 'react';

const artists = [
  {
    name: 'Freddie Mercury',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Freddie_Mercury_1984.1_cropped.jpg',
    id: 'freddie_liveaid'
  },
  {
    name: 'David Bowie',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/10/David-Bowie_Chicago_2002-08-08_photoby_Adam-Bielawski-cropped.jpg',
    id: 'bowie_starman'
  },
  {
    name: 'Prince',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Prince_at_Coachella_001.jpg',
    id: 'prince_purplerain'
  },
  {
    name: 'Kurt Cobain',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Kurt_Cobain_around_1992.jpg',
    id: 'kurt_unplugged'
  },
  {
    name: 'Beyoncé',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Beyonce_-_The_Formations_World_Tour%2C_at_Wembley_Stadium_in_London%2C_England.jpg',
    id: 'beyonce_superbowl'
  }
];

export default function App() {
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [uploadedFace, setUploadedFace] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedFace(reader.result);
    };
    if (file) reader.readAsDataURL(file);
  };

  const generateVideo = async () => {
    if (!uploadedFace || !selectedArtist) return;
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: uploadedFace, artistId: selectedArtist.id })
      });
      const data = await res.json();
      setVideoUrl(data.videoUrl);
    } catch (err) {
      console.error('Generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>🎤 RockU</h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Upload your face, pick a rock legend, and become the star.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
        {artists.map(artist => (
          <div key={artist.id} onClick={() => setSelectedArtist(artist)} style={{ cursor: 'pointer', border: selectedArtist?.id === artist.id ? '3px solid #f39c12' : '1px solid #ccc', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
            <img src={artist.image} alt={artist.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px' }} />
            <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>{artist.name}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {uploadedFace && selectedArtist && (
          <div style={{ marginTop: '1rem' }}>
            <button onClick={generateVideo} style={{ padding: '0.5rem 1.5rem', fontSize: '1rem', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              {loading ? 'Generating...' : 'Generate My Rockstar Video'}
            </button>
          </div>
        )}
      </div>

      {videoUrl && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <h2>Your RockU Clip</h2>
          <video controls style={{ width: '100%', maxWidth: '600px', borderRadius: '10px' }}>
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
      )}
    </div>
  );
}
