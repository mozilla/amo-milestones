import React from 'react';

function RemainingRequests(props) {
  const { ratelimitRemaining, ratelimitLimit } = props;

  if (!ratelimitRemaining || !ratelimitRemaining) {
    return null;
  }

  return (
    <em className="rate-limit pull-right">
      Remaining API Requests: {`${ratelimitRemaining}/${ratelimitLimit}`}
    </em>
  );
}

export default RemainingRequests;
