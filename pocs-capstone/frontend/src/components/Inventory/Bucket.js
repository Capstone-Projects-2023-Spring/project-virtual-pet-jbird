import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function Bucket() {
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
      // The type (or types) to accept - strings or symbols
      accept: 'BOX',
      // Props to collect
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
      })
    }))
    return (
        <DndProvider backend={HTML5Backend}>
            <div
                ref={drop}
                role={'Dustbin'}
                syl
                style={{  border: "5px solid black", height: 500, width: 500, backgroundColor: isOver ? 'red' : 'white' }}
            >
                {canDrop ? 'Release to drop' : 'Drag a box here'}
            </div>
        </DndProvider>
      
    )
  }

  export default Bucket;