import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, Button, Card, CardContent, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/system';
import Modal from 'react-modal';
import AddIcon from '@mui/icons-material/Add';

interface Post {
  id: bigint;
  title: string;
  body: string;
  author: string;
  timestamp: bigint;
}

const HeroSection = styled('div')(({ theme }) => ({
  backgroundImage: 'url(https://images.unsplash.com/photo-1639762846556-8fe3401b69d5?ixid=M3w2MzIxNTd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjQ2OTc3NTZ8&ixlib=rb-4.0.3)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  padding: theme.spacing(8),
  marginBottom: theme.spacing(4),
}));

const FloatingButton = styled(Button)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
}));

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', body: '', author: '' });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    try {
      setLoading(true);
      await backend.createPost(newPost.title, newPost.body, newPost.author);
      setModalIsOpen(false);
      setNewPost({ title: '', body: '', author: '' });
      await fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      <HeroSection>
        <Typography variant="h2" component="h1" gutterBottom>
          Crypto Blog
        </Typography>
        <Typography variant="h5">
          Explore the latest in cryptocurrency and blockchain technology
        </Typography>
      </HeroSection>

      <Container>
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          posts.map((post) => (
            <Card key={Number(post.id)} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {post.title}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  By {post.author} | {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
                </Typography>
                <Typography variant="body1">{post.body}</Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Container>

      <FloatingButton
        variant="contained"
        color="secondary"
        startIcon={<AddIcon />}
        onClick={() => setModalIsOpen(true)}
      >
        Create Post
      </FloatingButton>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '500px',
            width: '100%',
          },
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Create New Post
        </Typography>
        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleCreatePost(); }}>
          <Box mb={2}>
            <Typography variant="subtitle1">Title</Typography>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              style={{ width: '100%', padding: '8px' }}
              required
            />
          </Box>
          <Box mb={2}>
            <Typography variant="subtitle1">Body</Typography>
            <textarea
              value={newPost.body}
              onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
              style={{ width: '100%', padding: '8px', minHeight: '100px' }}
              required
            />
          </Box>
          <Box mb={2}>
            <Typography variant="subtitle1">Author</Typography>
            <input
              type="text"
              value={newPost.author}
              onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
              style={{ width: '100%', padding: '8px' }}
              required
            />
          </Box>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default App;