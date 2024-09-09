import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { title, content, author } = req.body;
      const token = req.headers.authorization;
      const response = await axios.post(
        'http://localhost:8080/post/create/66dd5a565e5c0727974510fd',
        { title, content, author },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      res.status(201).json(response.data);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create blog post' });
    }
  }
}
