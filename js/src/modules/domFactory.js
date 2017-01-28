export default class DomFactory {
  entry(id, amount, shortDescription, category) {
    return $.get('../../templates/entry.html');
  }

  modal() {
    return $.get('../../templates/modal.html');
  }

  categoryDropdownOption(categoryIndex, category, isSelected = false) {
    let selected = isSelected ? 'selected="selected"' : '';
    return `<option value="${categoryIndex}" ${selected}>${category}</option>`;
  }
}
