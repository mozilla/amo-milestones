import React from 'react';

function RemainingRequests(props) {
  const { ratelimitRemaining, ratelimitLimit } = props;
  return (
    <em className="rate-limit pull-right">
      Remaining API Requests: {`${ratelimitRemaining}/${ratelimitLimit}`}
    </em>
  );
}

export default RemainingRequests;
