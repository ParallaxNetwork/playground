import React, { useState } from 'react'
import { Zoom } from '@mui/material';

import EngangeExploreIdol from './EngangeExploreIdol'
import EngangeIdol from './EngangeIdol'

import ShadowBox from '../elements/ShadowBox'
import LayoutContainer from '../elements/Container';

export default function EngangeBox() {
  const [selectedIdol, setSelectedIdol] = useState(null);

  return (
    <Zoom in>
      <div>
        <LayoutContainer>
          <ShadowBox className={"shadowBox"}>
            {!selectedIdol &&
              <EngangeExploreIdol setSelectedIdol={setSelectedIdol} />
            }

            {selectedIdol &&
              <EngangeIdol selectedIdol={selectedIdol} setSelectedIdol={setSelectedIdol} />
            }
          </ShadowBox>
        </LayoutContainer>
      </div>
    </Zoom>
  )
}