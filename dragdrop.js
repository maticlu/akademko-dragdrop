class EQDragDrop {
    constructor(element) {
        this.element = element;
        this.elementChildren = this.element.childNodes;
        this.currentDrag = null;
        this.dragOverElement = null;
        this.dragOverPosition = null;
        this.dragOverTime = Date.now();
        this.enableDraggable();
        this.dragListeners();
    }

    /** Enable Draggable on Child Elements */
    enableDraggable() {
        this.element.childNodes.forEach((node) => {
            node.setAttribute('draggable', 'true');
        });
    }

    /** Add drag listeners */
    dragListeners() {
        this.elementChildren.forEach((node) => {
            node.addEventListener('dragstart', (event) => this.dragStart(event));
            node.addEventListener('dragover', (event) => this.dragOver(event));
            node.addEventListener('dragend', (event) => this.dragEnd(event));
            node.addEventListener('drop', (event) => this.drop(event));
        });
    }
    dragStart(event) {
        this.currentDrag = event.target;
        this.currentDrag.classList.add('drag');
    }
    dragOver(event) {
        event.preventDefault();

        // Allow only 10 drag checks per second.
        const currentTimeStamp = Date.now();
        if (currentTimeStamp - this.dragOverTime <= 100) {
            return false;
        }

        this.dragOverElement = event.target;

        // Stop if we are draging over same element.
        if (event.target == this.currentDrag) {
            return false;
        }

        const dragOverTop = this.dragOverElement.offsetTop;
        const dragOverHeight = this.dragOverElement.offsetHeight;
        const dragLimit = dragOverTop + dragOverHeight / 2;
        const clientY = event.clientY;

        if (clientY > dragLimit) {
            this.dragOverPosition = 'after';
        } else {
            this.dragOverPosition = 'before';
        }
        this.switchPosition();
    }
    clearDragOverClasses() {
        this.elementChildren.forEach((draggableElement) => {
            draggableElement.classList.remove('drag');
        });
    }
    dragEnd(event) {
        this.clearDragOverClasses();
    }
    drop(event) {}
    switchPosition() {
        if (this.dragOverPosition === 'before') {
            this.dragOverElement.parentNode.insertBefore(this.currentDrag, this.dragOverElement);
        } else {
            this.dragOverElement.parentNode.insertBefore(this.currentDrag, this.dragOverElement.nextSibling);
        }
    }
}

export default EQDragDrop;
