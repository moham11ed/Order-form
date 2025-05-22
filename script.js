document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('productForm');
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const btnNextList = document.querySelectorAll('.btn-next');
    const btnPrevList = document.querySelectorAll('.btn-prev');
    const oilsCheckboxes = document.querySelectorAll('input[name="oils"]');
    const oilsError = document.getElementById('oilsError');
    const productPreview = document.getElementById('productPreview');
    const approveBtn = document.getElementById('approveBtn');
    const rejectBtn = document.getElementById('rejectBtn');
    const customDesign = document.getElementById('customDesign');
    const orderSummary = document.getElementById('orderSummary');
    
    let currentStep = 0;
    
    // التحقق من اختيار 3 زيوت فقط
    oilsCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedOils = document.querySelectorAll('input[name="oils"]:checked');
            if (checkedOils.length > 3) {
                this.checked = false;
                oilsError.style.display = 'block';
                setTimeout(() => {
                    oilsError.style.display = 'none';
                }, 3000);
            }
        });
    });
    
    // عرض معاينة التصميم عند اختيار شكل وتصميم الزجاجة
    function updatePreview() {
        const selectedShape = document.querySelector('input[name="bottleShape"]:checked');
        const selectedDesign = document.querySelector('input[name="bottleDesign"]:checked');
        
        if (selectedShape && selectedDesign) {
            // هنا يمكنك إضافة منطق لعرض معاينة المنتج
            // في هذا المثال، سنعرض فقط رسالة بسيطة
            productPreview.innerHTML = `
                <p>معاينة المنتج:</p>
                <p>النوع: ${document.querySelector('input[name="productType"]:checked')?.value || 'غير محدد'}</p>
                <p>الشكل: ${selectedShape.value}</p>
                <p>التصميم: ${selectedDesign.value}</p>
            `;
            
            // إذا كان هناك تصميم مرفوع، عرضه
            if (customDesign.files && customDesign.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    productPreview.innerHTML = '';
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.maxWidth = '100%';
                    img.style.maxHeight = '100%';
                    productPreview.appendChild(img);
                };
                reader.readAsDataURL(customDesign.files[0]);
            }
        }
    }
    
    // تحديث شريط التقدم
    function updateProgressBar() {
        progressSteps.forEach((step, index) => {
            if (index < currentStep + 1) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
    
    // عرض ملخص الطلب
    function updateOrderSummary() {
        const formData = new FormData(form);
        const productData = {};
        formData.forEach((value, key) => {
            productData[key] = value;
        });
        
        const checkedOils = Array.from(document.querySelectorAll('input[name="oils"]:checked')).map(oil => oil.value);
        
        orderSummary.innerHTML = `
            <h3>ملخص الطلب</h3>
            <p><strong>نوع المنتج:</strong> ${productData.productType || 'غير محدد'}</p>
            <p><strong>الزيوت المختارة:</strong> ${checkedOils.join('، ') || 'لم يتم الاختيار'}</p>
            <p><strong>شكل الزجاجة:</strong> ${productData.bottleShape || 'غير محدد'}</p>
            <p><strong>تصميم الزجاجة:</strong> ${productData.bottleDesign || 'غير محدد'}</p>
            <p><strong>اسم المنتج:</strong> ${productData.productName || 'غير محدد'}</p>
            <p><strong>عدد الزجاجات:</strong> ${productData.quantity || '0'}</p>
            <hr>
            <h4>معلومات العميل</h4>
            <p><strong>الاسم:</strong> ${productData.customerName || 'غير محدد'}</p>
            <p><strong>البريد الإلكتروني:</strong> ${productData.customerEmail || 'غير محدد'}</p>
            <p><strong>رقم الهاتف:</strong> ${productData.customerPhone || 'غير محدد'}</p>
            <p><strong>العنوان:</strong> ${productData.customerAddress || 'غير محدد'}</p>
        `;
    }
    
    // الانتقال بين الخطوات
    function goToStep(step) {
        formSteps.forEach((formStep, index) => {
            formStep.classList.toggle('active', index === step);
        });
        currentStep = step;
        updateProgressBar();
        
        // إذا كانت الخطوة الأخيرة (التأكيد)، قم بتحديث ملخص الطلب
        if (step === 5) {
            updateOrderSummary();
        }
    }
    
    // معالجة أزرار التالي
    btnNextList.forEach(btn => {
        btn.addEventListener('click', function() {
            // التحقق من صحة البيانات قبل الانتقال للخطوة التالية
            let isValid = true;
            const currentFormStep = formSteps[currentStep];
            
            // التحقق من الحقول المطلوبة في الخطوة الحالية
            const inputs = currentFormStep.querySelectorAll('input[required], select[required]');
            inputs.forEach(input => {
                if (!input.value) {
                    input.style.borderColor = '#e74c3c';
                    isValid = false;
                    setTimeout(() => {
                        input.style.borderColor = '#ddd';
                    }, 2000);
                }
            });
            
            // التحقق من اختيار 3 زيوت في الخطوة 1
            if (currentStep === 0) {
                const checkedOils = document.querySelectorAll('input[name="oils"]:checked');
                if (checkedOils.length !== 3) {
                    oilsError.style.display = 'block';
                    isValid = false;
                }
            }
            
            // إذا كانت البيانات صحيحة، انتقل للخطوة التالية
            if (isValid) {
                if (currentStep === 2) {
                    updatePreview();
                }
                
                if (currentStep < formSteps.length - 1) {
                    goToStep(currentStep + 1);
                } else {
                    // إرسال النموذج إذا كانت الخطوة الأخيرة
                    form.submit();
                }
            }
        });
    });
    
    // معالجة أزرار السابق
    btnPrevList.forEach(btn => {
        btn.addEventListener('click', function() {
            if (currentStep > 0) {
                goToStep(currentStep - 1);
            }
        });
    });
    
    // معالجة أزرار الموافقة والرفض
    approveBtn.addEventListener('click', function() {
        alert('تم الموافقة على التصميم! يمكنك متابعة تعبئة باقي البيانات.');
    });
    
    rejectBtn.addEventListener('click', function() {
        const confirmReject = confirm('هل أنت متأكد من رفض التصميم الحالي؟ سيتم مسح جميع الخيارات.');
        if (confirmReject) {
            document.querySelectorAll('input[name="bottleDesign"]').forEach(input => input.checked = false);
            customDesign.value = '';
            productPreview.innerHTML = '';
        }
    });
    
    // تحديث المعاينة عند تغيير التصميم
    document.querySelectorAll('input[name="bottleShape"], input[name="bottleDesign"]').forEach(input => {
        input.addEventListener('change', updatePreview);
    });
    
    customDesign.addEventListener('change', updatePreview);
    
    // معالجة إرسال النموذج
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // جمع بيانات النموذج
        const formData = new FormData(form);
        const productData = {};
        formData.forEach((value, key) => {
            productData[key] = value;
        });
        
        // إضافة الزيوت المختارة
        productData.oils = Array.from(document.querySelectorAll('input[name="oils"]:checked')).map(oil => oil.value);
        
        // هنا يمكنك إرسال البيانات إلى الخادم أو معالجتها
        console.log('بيانات المنتج:', productData);
        alert('تم إرسال الطلب بنجاح! شكراً لاستخدامك خدمتنا.');
        form.reset();
        goToStep(0);
    });
    
    // بدء التطبيق بالخطوة الأولى
    goToStep(0);
});