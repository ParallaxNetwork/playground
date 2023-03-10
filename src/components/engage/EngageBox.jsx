import React, { useState } from 'react'
import { Zoom } from '@mui/material';

import EngageExploreIdol from './EngageExploreIdol'
import EngageIdol from './EngageIdol'

import ShadowBox from '../elements/ShadowBox'
import LayoutContainer from '../elements/Container';

export default function EngageBox() {
  const [selectedIdol, setSelectedIdol] = useState(null);

  return (
    <Zoom in>
      <div>
        <LayoutContainer>
          <ShadowBox className={"shadowBox"}>
            {!selectedIdol &&
              <EngageExploreIdol setSelectedIdol={setSelectedIdol} />
            }

            {selectedIdol &&
              <EngageIdol selectedIdol={selectedIdol} setSelectedIdol={setSelectedIdol} />
            }
          </ShadowBox>
        </LayoutContainer>
      </div>
    </Zoom>
  )
}