

#  **Task 3: Submission Form UI Design**

##  **Overview**

This project is a **Submission Form UI** created using **HTML5 and CSS3**, inspired by a real-world award submission layout.
The design includes:

* A clean **two-column layout**
* A left section with heading + description
* A right section containing a fully structured **form**
* A diagonal bottom-right **slanted white shape** made using CSS `clip-path`
* Custom-styled inputs, textareas, checkboxes, and a submission button

This task demonstrates your ability to build real UI components using raw HTML + CSS without frameworks.

---

##  **Features**

* Clean two-column layout built using Flexbox for a modern, responsive structure.
* Custom-styled form inputs, textareas, and checkboxes with a minimal, elegant look.
* Unique diagonal bottom-right design created using CSS `clip-path` for visual appeal.
* Organized form sections using CSS Grid for proper spacing and alignment.
* Fully functional award submission UI built with pure HTML5 and CSS3 only.

---

##  **Screenshot**

> the output of webpage is added with task3.png 



---

##  **Technologies Used**

| Technology        | Purpose                             |
| ----------------- | ----------------------------------- |
| **HTML5**         | Structure, semantic layout          |
| **CSS3**          | Styling, layout, clip-path geometry |
| **Flexbox**       | For the main two-column layout      |
| **CSS Grid**      | For organizing form elements        |
| **CSS clip-path** | For diagonal bottom-right cut       |

---


### ** Diagonal Corner Effect**

Implemented with:

```css
.parent::after {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100px;
    height: 100px;
    background: white;
    clip-path: polygon(100% 0, 0 100%, 100% 100%);
}
```

This creates a **white triangular cut** at the bottom-right corner.

---

##  **Conclusion**

This Task 3 Submission Form project demonstrates a strong understanding of modern CSS layout techniques and UI styling. It replicates a professional award submission interface using only HTML and CSS, showcasing your frontend design capabilities.

---

**Author:** Irfanullah
