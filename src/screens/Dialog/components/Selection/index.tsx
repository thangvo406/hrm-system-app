import type { TSelectionProps } from '@type/dialog';

import ListVariant from './ListVariant';
import React from 'react';
import TimeVariant from './TimeVariant';

function Selection(props: TSelectionProps) {
  if (props.type === 'timeSheet') {
    return <TimeVariant {...props} />;
  }

  return <ListVariant {...props} />;
}

export default React.memo(Selection);
