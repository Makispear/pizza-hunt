const { Comment, Pizza } = require('../models')
const pizza404Message = 'No pizza found with this id!'
const comment404Message = 'No comment with this id!'

const commentController = {
    // add comment to pizza 
    addComment({ params, body }, res) {
        console.log(body);
        Comment.create(body)
          .then(({ _id }) => {
            return Pizza.findOneAndUpdate(
              { _id: params.pizzaId },
              { $push: { comments: _id } },
              { new: true }
            );
          })
          .then(dbPizzaData => {
            if (!dbPizzaData) {
              res.status(404).json({ message: pizza404Message });
              return;
            }
            res.json(dbPizzaData);
          })
          .catch(err => res.json(err));
      },

    //   remove a comment 
    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId })
          .then(deletedComment => {
            if (!deletedComment) {
              return res.status(404).json({ message: comment404Message });
            }
            return Pizza.findOneAndUpdate(
              { _id: params.pizzaId },
              { $pull: { comments: params.commentId } },
              { new: true }
            );
          })
          .then(dbPizzaData => {
            if (!dbPizzaData) {
              res.status(404).json({ message: pizza404Message });
              return;
            }
            res.json(dbPizzaData);
          })
          .catch(err => res.json(err));
      }
}

module.exports = commentController