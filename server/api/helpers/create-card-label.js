module.exports = {
  inputs: {
    card: {
      type: 'ref',
      required: true,
    },
    label: {
      type: 'ref',
      required: true,
    },
    request: {
      type: 'ref',
    },
  },

  exits: {
    labelAlreadyInCard: {},
  },

  async fn(inputs, exits) {
    const cardLabel = await CardLabel.create({
      cardId: inputs.card.id,
      labelId: inputs.label.id,
    })
      .intercept('E_UNIQUE', 'labelAlreadyInCard')
      .fetch();

    sails.sockets.broadcast(
      `board:${inputs.card.boardId}`,
      'cardLabelCreate',
      {
        item: cardLabel,
      },
      inputs.request,
    );

    return exits.success(cardLabel);
  },
};
