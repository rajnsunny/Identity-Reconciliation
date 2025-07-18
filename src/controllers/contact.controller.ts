import { Request, Response } from 'express';
import service from '../services';

export const identifyContact = async (req: Request, res: Response) => {
  try {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      return res.status(400).json({ error: 'Email or phoneNumber is required' });
    }

    const result = await service.identifyService(email, phoneNumber);
    return res.status(200).json({ contact: result });

  } catch (error) {
    console.error('Error in identifyContact:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
