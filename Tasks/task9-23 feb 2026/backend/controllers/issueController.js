import Issue from '../models/Issue.js';
import Book from '../models/Book.js';
import Member from '../models/Member.js';

// Get all issues
export const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find({}).populate('bookId', 'title bookId').populate('memberId', 'name memberId');
    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Issue a book
export const issueBook = async (req, res) => {
  try {
    const { bookId, memberId, returnDate } = req.body;
    
    // Validate book and member
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.quantity <= 0) return res.status(400).json({ message: 'Book is currently out of stock' });

    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    // Deduct book quantity
    book.quantity -= 1;
    book.availabilityStatus = book.quantity > 0;
    await book.save();

    // Create Issue record
    const newIssue = new Issue({ bookId, memberId, returnDate });
    await newIssue.save();

    // Add to member issues
    member.issuedBooks.push(newIssue._id);
    await member.save();

    res.status(201).json(newIssue);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Return a book
export const returnBook = async (req, res) => {
  try {
    const { id } = req.params; // Issue document ID
    
    const issue = await Issue.findById(id).populate('bookId');
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    if (issue.status === 'Returned') return res.status(400).json({ message: 'Book is already returned' });

    // Update Issue status
    issue.status = 'Returned';
    issue.returnDate = Date.now();
    
    // Calculate fine: Assume 50 units fine per day late
    const expectedReturnDate = new Date(issue.returnDate);
    const currentDate = new Date();
    if (currentDate > expectedReturnDate) {
      const diffTime = Math.abs(currentDate - expectedReturnDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      issue.fine = diffDays * 50; 
    }
    await issue.save();

    // Restore book quantity
    const book = await Book.findById(issue.bookId._id);
    if (book) {
      book.quantity += 1;
      book.availabilityStatus = true;
      await book.save();
    }
    
    res.status(200).json(issue);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
